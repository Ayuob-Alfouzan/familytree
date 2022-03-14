package com.familytree.service.mapper.account;

import com.familytree.domain.account.User;
import com.familytree.service.dto.account.UserDTO;
import com.familytree.service.mapper.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface UserMapper extends EntityMapper<UserDTO, User> {
    UserDTO toDto(User user);
}
