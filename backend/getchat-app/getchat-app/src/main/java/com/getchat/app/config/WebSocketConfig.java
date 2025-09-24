package com.getchat.app.config;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Value("${frontend.url}")
    private String allowedOrigin;

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        //client will subscribe to /chat endpoint or 'topic'
        registry.addEndpoint("/chat")
                .setAllowedOrigins(allowedOrigin)
                .withSockJS(); //websocket fallback


    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // if server tries sennding messages it will search for /topic prefix endpoints only
        config.enableSimpleBroker("/topic");

        config.setApplicationDestinationPrefixes("/app");
        //sets controller destination endpoint prefix
        // /app/chat
        // server-side controller: @MessagingMapping("/chat")


    }
}
