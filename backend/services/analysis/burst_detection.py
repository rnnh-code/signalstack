"""
Implementation of Kleinberg's burst detection algorithm for SignalStack.

This algorithm detects "bursts" of activity in temporal data, which helps
identify rapidly emerging trends in social media discussions.

Reference:
Kleinberg, J. (2003). Bursty and hierarchical structure in streams.
Data Mining and Knowledge Discovery, 7(4), 373-397.
"""
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
import logging
from datetime import datetime
import math

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class BurstDetector:
    """
    Implementation of Kleinberg's burst detection algorithm to identify
    periods of increased activity in temporal data.
    """
    
    def __init__(self, 
                gamma: float = 1.0, 
                s: float = 2.0, 
                window_size: int = 7,
                min_burst_length: int = 2):
        """
        Initialize the burst detector.
        
        Args:
            gamma: Cost parameter for state transitions
            s: Scaling parameter for burst states
            window_size: Time window size in days for smoothing
            min_burst_length: Minimum length of a burst to be considered valid
        """
        self.gamma = gamma
        self.s = s
        self.window_size = window_size
        self.min_burst_length = min_burst_length
        
    def detect_bursts(self, 
                     timestamps: List[float], 
                     num_states: int = 2) -> List[Dict[str, Any]]:
        """
        Detect bursts in temporal data based on timestamps.
        
        Args:
            timestamps: List of UNIX timestamps representing events
            num_states: Number of burst states (1 = baseline, 2+ = burst levels)
            
        Returns:
            List of detected bursts with start time, end time, and intensity
        """
        if not timestamps or len(timestamps) < self.min_burst_length:
            logger.warning("Not enough data points for burst detection")
            return []
            
        # Sort timestamps and convert to days from earliest timestamp
        timestamps = sorted(timestamps)
        base_time = min(timestamps)
        days = [(t - base_time) / (24 * 3600) for t in timestamps]
        
        # Create time series from timestamps
        max_day = math.ceil(max(days))
        time_series = self._create_time_series(days, max_day)
        
        # Smooth the time series
        smoothed = self._smooth_time_series(time_series, self.window_size)
        
        # Run the burst detection algorithm
        bursts = self._find_bursts(smoothed, num_states)
        
        # Convert back to original timestamp format
        result = []
        for burst in bursts:
            start_time = base_time + burst['start'] * 24 * 3600
            end_time = base_time + burst['end'] * 24 * 3600
            
            result.append({
                'start_time': start_time,
                'end_time': end_time,
                'duration_days': burst['end'] - burst['start'],
                'intensity': burst['intensity'],
                'start_date': datetime.fromtimestamp(start_time).strftime('%Y-%m-%d'),
                'end_date': datetime.fromtimestamp(end_time).strftime('%Y-%m-%d')
            })
            
        return result
        
    def _create_time_series(self, days: List[float], max_day: float) -> np.ndarray:
        """Convert irregular timestamps to a daily count time series."""
        # Create bins for each day
        bins = np.arange(0, max_day + 1)
        # Count events in each bin
        counts, _ = np.histogram(days, bins=bins)
        return counts
        
    def _smooth_time_series(self, series: np.ndarray, window_size: int) -> np.ndarray:
        """Apply a moving average smoothing to the time series."""
        # Simple moving average
        smoothed = np.convolve(series, np.ones(window_size)/window_size, mode='same')
        # At edges, use whatever window size is available
        for i in range(min(window_size//2, len(smoothed))):
            if i == 0:
                smoothed[i] = series[i]
            else:
                smoothed[i] = np.mean(series[:i*2])
                smoothed[-i-1] = np.mean(series[-i*2:])
        return smoothed
        
    def _find_bursts(self, time_series: np.ndarray, num_states: int) -> List[Dict[str, Any]]:
        """
        Core implementation of Kleinberg's burst detection algorithm.
        
        Args:
            time_series: Smoothed daily event counts
            num_states: Number of burst states (1 = baseline, 2+ = burst levels)
            
        Returns:
            List of detected bursts with start index, end index, and intensity
        """
        n = len(time_series)
        if n == 0:
            return []
            
        # Compute the baseline rate
        total_events = np.sum(time_series)
        if total_events == 0:
            return []
            
        baseline_rate = total_events / n
        
        # Create rate scaling for each state
        rates = [baseline_rate * (self.s ** i) for i in range(num_states)]
        
        # Initialize cost and state matrices
        cost = np.zeros((n, num_states))
        state = np.zeros((n, num_states), dtype=int)
        
        # Dynamic programming to find optimal state sequence
        for t in range(n):
            for j in range(num_states):
                # Cost of observing x[t] events in state j
                if time_series[t] > 0:
                    event_cost = -time_series[t] * np.log(rates[j])
                else:
                    event_cost = 0
                    
                # Find optimal previous state
                if t == 0:
                    # First time point - no transition cost
                    cost[t, j] = event_cost
                    state[t, j] = j
                else:
                    # Consider all possible transitions
                    options = []
                    for i in range(num_states):
                        # Transition cost: higher for moving up states
                        if j > i:
                            # Cost for transitioning to a higher state
                            trans_cost = self.gamma * (j - i)
                        else:
                            # No cost for maintaining or decreasing state
                            trans_cost = 0
                        options.append(cost[t-1, i] + trans_cost)
                    
                    # Choose the minimum cost transition
                    prev_state = np.argmin(options)
                    cost[t, j] = event_cost + options[prev_state]
                    state[t, j] = prev_state
        
        # Backtrack to find optimal state sequence
        optimal_states = np.zeros(n, dtype=int)
        optimal_states[-1] = np.argmin(cost[-1, :])
        for t in range(n-2, -1, -1):
            optimal_states[t] = state[t+1, optimal_states[t+1]]
        
        # Extract bursts (state > 0)
        bursts = []
        current_burst = None
        
        for t in range(n):
            if optimal_states[t] > 0:
                # In a burst state
                if current_burst is None:
                    # Start a new burst
                    current_burst = {
                        'start': t,
                        'intensity': optimal_states[t]
                    }
            elif current_burst is not None:
                # End the current burst
                current_burst['end'] = t - 1
                
                # Only keep bursts that are long enough
                if (current_burst['end'] - current_burst['start'] + 1) >= self.min_burst_length:
                    bursts.append(current_burst)
                
                current_burst = None
                
        # Don't forget the last burst if we ended in a burst state
        if current_burst is not None:
            current_burst['end'] = n - 1
            if (current_burst['end'] - current_burst['start'] + 1) >= self.min_burst_length:
                bursts.append(current_burst)
                
        return bursts
        
    def get_trend_velocity(self, timestamps: List[float]) -> str:
        """
        Calculate trend velocity based on burst detection.
        
        Args:
            timestamps: List of UNIX timestamps representing events
            
        Returns:
            Velocity label: "High", "Medium", "Rising", or "Low"
        """
        if not timestamps or len(timestamps) < 3:
            return "Low"  # Not enough data
        
        # Detect bursts
        bursts = self.detect_bursts(timestamps)
        
        if not bursts:
            # No bursts detected
            return "Low"
            
        # Get the most recent burst
        latest_burst = max(bursts, key=lambda x: x['end_time'])
        
        # Check if the burst is recent (within the last window_size days)
        now = datetime.now().timestamp()
        max_age_seconds = self.window_size * 24 * 3600
        
        if (now - latest_burst['end_time']) <= max_age_seconds:
            # Recent burst - classify by intensity
            if latest_burst['intensity'] >= 2:
                return "High"
            else:
                return "Medium"
        else:
            # Older burst
            return "Rising"
