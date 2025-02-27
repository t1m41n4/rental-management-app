import redis
from typing import Optional

redis_client = redis.Redis.from_url("redis://redis:6379/0")


def get_redis():
    return redis_client


def cache_data(key: str, value: str, expire: int = 3600) -> None:
    """Cache data with an expiration time (default: 1 hour)."""
    redis_client.setex(key, expire, value)


def get_cached_data(key: str) -> Optional[str]:
    """Retrieve cached data."""
    return redis_client.get(key)