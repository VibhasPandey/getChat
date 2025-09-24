package com.getchat.app.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.getchat.app.entities.Room;
public interface RoomRepository extends MongoRepository<Room,String> {

    //get room using roomID
    Room findByRoomId(String roomId);
}
