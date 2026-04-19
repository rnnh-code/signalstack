"""
Text embedding utilities for SignalStack trend analysis.
Uses Sentence-BERT for semantic text representation.
"""
from sentence_transformers import SentenceTransformer
import numpy as np
from typing import List, Dict, Any, Union
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instance - lazy loaded when needed
_model = None

def get_embedding_model() -> SentenceTransformer:
    """
    Returns a singleton instance of the Sentence-BERT model.
    Uses lazy loading to avoid unnecessary memory usage until needed.
    """
    global _model
    if _model is None:
        logger.info("Loading Sentence-BERT model...")
        # Use a smaller, faster model for the MVP
        _model = SentenceTransformer('all-MiniLM-L6-v2')
        logger.info("Sentence-BERT model loaded successfully")
    return _model

def embed_texts(texts: List[str]) -> np.ndarray:
    """
    Convert a list of texts into their embedding representations.
    
    Args:
        texts: List of text strings to embed
        
    Returns:
        numpy array of embedding vectors with shape (len(texts), embedding_dim)
    """
    if not texts:
        return np.array([])
        
    model = get_embedding_model()
    embeddings = model.encode(texts, show_progress_bar=False)
    return embeddings

def get_text_similarity(text1: str, text2: str) -> float:
    """
    Calculate the cosine similarity between two text strings.
    
    Args:
        text1: First text string
        text2: Second text string
        
    Returns:
        Similarity score between 0 and 1
    """
    model = get_embedding_model()
    embedding1 = model.encode(text1, show_progress_bar=False)
    embedding2 = model.encode(text2, show_progress_bar=False)
    
    # Compute cosine similarity
    similarity = np.dot(embedding1, embedding2) / (np.linalg.norm(embedding1) * np.linalg.norm(embedding2))
    return float(similarity)

def find_similar_texts(query: str, candidates: List[str], threshold: float = 0.6) -> List[Dict[str, Any]]:
    """
    Find texts that are semantically similar to the query text.
    
    Args:
        query: The query text to compare against
        candidates: List of candidate texts to search through
        threshold: Minimum similarity score to consider a match
        
    Returns:
        List of dicts with text content and similarity scores, sorted by descending similarity
    """
    if not candidates:
        return []
        
    model = get_embedding_model()
    query_embedding = model.encode(query, show_progress_bar=False)
    candidate_embeddings = model.encode(candidates, show_progress_bar=False)
    
    # Calculate similarities
    similarities = []
    for i, embedding in enumerate(candidate_embeddings):
        similarity = np.dot(query_embedding, embedding) / (np.linalg.norm(query_embedding) * np.linalg.norm(embedding))
        similarities.append({
            'text': candidates[i],
            'similarity': float(similarity),
            'index': i
        })
    
    # Filter by threshold and sort by similarity
    results = [s for s in similarities if s['similarity'] >= threshold]
    results.sort(key=lambda x: x['similarity'], reverse=True)
    
    return results
