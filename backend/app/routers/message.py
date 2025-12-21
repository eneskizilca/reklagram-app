# backend/app/routers/message.py

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..models.message import Message
from ..models.user import User
from ..schemas.message import MessageCreate, MessageOut
from ..dependencies.auth import get_current_user, get_db
from ..schemas.user import User as UserSchema

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)


@router.post("/", response_model=MessageOut, status_code=status.HTTP_201_CREATED)
def send_message(
    message_data: MessageCreate,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Send a message to another user.
    Requires authentication.
    """
    # Check if receiver exists
    receiver = db.query(User).filter(User.id == message_data.receiver_id).first()
    if not receiver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Receiver user not found"
        )
    
    # Prevent users from sending messages to themselves
    if current_user.id == message_data.receiver_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot send message to yourself"
        )
    
    # Create new message
    new_message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=message_data.content,
        is_read=False
    )
    
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    
    # Convert to MessageOut schema
    message_out = MessageOut.model_validate(new_message)
    return message_out


@router.get("/{other_user_id}", response_model=List[MessageOut])
def get_conversation(
    other_user_id: int,
    current_user: UserSchema = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get conversation history with a specific user.
    Returns both sent and received messages, ordered by timestamp.
    Requires authentication.
    """
    # Check if other user exists
    other_user = db.query(User).filter(User.id == other_user_id).first()
    if not other_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Get all messages between current user and other user
    messages = db.query(Message).filter(
        (
            (Message.sender_id == current_user.id) & (Message.receiver_id == other_user_id)
        ) | (
            (Message.sender_id == other_user_id) & (Message.receiver_id == current_user.id)
        )
    ).order_by(Message.timestamp.asc()).all()
    
    # Mark received messages as read
    for message in messages:
        if message.receiver_id == current_user.id and not message.is_read:
            message.is_read = True
    
    db.commit()
    
    # Convert to MessageOut schema
    return [MessageOut.model_validate(msg) for msg in messages]

