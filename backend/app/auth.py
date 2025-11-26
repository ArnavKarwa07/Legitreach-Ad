"""
Authentication dependencies for FastAPI.

Provides a simple auth mechanism that:
- Accepts clerk_user_id from header or request body
- Looks up or creates User in database
- Attaches user to request context

This is a simplified implementation that can be hardened with full JWT
verification from Clerk later.
"""
from typing import Optional
from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.db import get_db
from app.models import User


async def get_current_user(
    x_clerk_user_id: Optional[str] = Header(None, alias="X-Clerk-User-Id"),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Dependency that extracts and validates the current user.
    
    Accepts clerk_user_id from:
    - X-Clerk-User-Id header (preferred)
    
    If the user doesn't exist, creates a new User record.
    
    TODO: Implement full JWT verification from Clerk for production.
    """
    clerk_user_id = x_clerk_user_id
    
    if not clerk_user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication. Provide X-Clerk-User-Id header.",
        )
    
    # Look up user
    result = await db.execute(
        select(User).where(User.clerk_user_id == clerk_user_id)
    )
    user = result.scalar_one_or_none()
    
    # Create if not exists
    if not user:
        user = User(clerk_user_id=clerk_user_id)
        db.add(user)
        await db.commit()
        await db.refresh(user)
    
    return user


async def get_optional_user(
    x_clerk_user_id: Optional[str] = Header(None, alias="X-Clerk-User-Id"),
    db: AsyncSession = Depends(get_db),
) -> Optional[User]:
    """
    Optional auth dependency - returns None if no auth provided.
    """
    if not x_clerk_user_id:
        return None
    
    result = await db.execute(
        select(User).where(User.clerk_user_id == x_clerk_user_id)
    )
    return result.scalar_one_or_none()
