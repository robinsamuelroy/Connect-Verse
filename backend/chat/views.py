from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import permissions,status,generics
from rest_framework.views import APIView
from .serialziers import  * 
from rest_framework.response import Response
from django.db.models import Q
from django.shortcuts import get_object_or_404
from accounts.models import BlockUser
from post.models import *

User = get_user_model()

class CreateChatRoom(APIView):
    permission_classes = [permissions.IsAuthenticated]
    serailzier_class = RoomSerializer

    def post(self,request,pk):
        current_user = request.user
        other_user = User.objects.get(pk=pk)

        existing_chat_rooms = Room.objects.filter(members = current_user).filter(members = other_user)

        if existing_chat_rooms.exists():
            serializer = RoomSerializer(existing_chat_rooms.first())
            return Response(serializer.data,status=status.HTTP_200_OK)
        
        chat_room = Room()
        chat_room.save()
        chat_room.members.add(current_user,other_user)

        serializer = RoomSerializer(chat_room)
        return Response (serializer.data , status = status.HTTP_201_CREATED)
    


    
class RoomMessageView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get(self,request,pk):
        try:
            room = get_object_or_404(Room, pk=pk)
            messages = Message.objects.filter(room=room)
            serialized_messages = self.serializer_class(messages,many=True).data
            return Response(serialized_messages,status.HTTP_200_OK)
        except Room.DoesNotExist:
            return Response('room not found', status= status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response(str(e),status= status.HTTP_500_INTERNAL_SERVER_ERROR)
        



        
class MessageSeenView(APIView):
    permission_classes=[permissions.IsAuthenticated]
    serializer_class = MessageSerializer

    def get(self,request,pk):
        current_user = request.user
        other_user = User.objects.get(pk=pk)
        if Room.objects.filter(members=current_user).filter(members=other_user).exists():
            chat_room = Room.objects.filter(members=current_user).filter(members=other_user).first()
            message_to_update = Message.objects.filter(Q(room=chat_room) & ~Q(sender = current_user))
            message_to_update.update(seen=True)
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({'error':'chat room not found.'}, status=status.HTTP_404_NOT_FOUND)
        

class ChatRoomListView(generics.ListAPIView):
    serializer_class = RoomListSerializer
    permission_classes = [permissions.IsAuthenticated]
   
    def get_queryset(self):
        user = self.request.user
       
        # Get IDs of users blocked by the current user
        blocked_user_ids = BlockUser.objects.filter(blocker=user).values_list('blocked_id', flat=True)

        # Filter rooms where the current user is a member and exclude rooms with any blocked members
        return Room.objects.filter(members=user).exclude(members__id__in=blocked_user_ids).distinct()
        