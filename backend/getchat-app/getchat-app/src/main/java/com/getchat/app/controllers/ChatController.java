package com.getchat.app.controllers;

import com.getchat.app.entities.Message;
import com.getchat.app.entities.Room;
import com.getchat.app.payload.MessageRequest;
import com.getchat.app.repositories.RoomRepository;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins= "${frontend.url}")
public class ChatController {

    private RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    //method for sending and receiving messages
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message  sendMessage(@DestinationVariable String roomId,
                                @RequestBody MessageRequest request){

        Room room=roomRepository.findByRoomId(request.getRoomId());

        Message message=new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimestamp(LocalDateTime.now());

        if(room!=null){
            room.getMessages().add(message);
            roomRepository.save(room);
        }else{
            throw new RuntimeException("Room not found!");
        }

        return message;

    }

}
