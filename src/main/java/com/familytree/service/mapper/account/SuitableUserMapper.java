package com.familytree.service.mapper.account;

import com.familytree.domain.account.User;
import com.familytree.service.dto.account.SuitableUserDTO;
import com.familytree.service.mapper.EntityMapper;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {})
public interface SuitableUserMapper extends EntityMapper<SuitableUserDTO, User> {
    SuitableUserDTO toDto(User user);
}
