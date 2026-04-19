"""
SignalStack trend analysis package.

This package provides tools for analyzing social media data to extract
actionable CPG innovation insights.
"""
from .trend_analyzer import TrendAnalyzer
from .text_embeddings import embed_texts, find_similar_texts
from .burst_detection import BurstDetector

__all__ = ['TrendAnalyzer', 'embed_texts', 'find_similar_texts', 'BurstDetector']
