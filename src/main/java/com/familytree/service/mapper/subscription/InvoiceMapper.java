package com.familytree.service.mapper.subscription;

import com.familytree.domain.subscription.Invoice;
import com.familytree.service.dto.subscription.InvoiceDTO;
import com.familytree.service.mapper.EntityMapper;
import com.familytree.service.mapper.util.LookupMapper;
import com.familytree.service.util.CommonUtil;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring", uses = { LookupMapper.class })
public interface InvoiceMapper extends EntityMapper<InvoiceDTO, Invoice> {
    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "subscription.id", target = "subscriptionId")
    @Mapping(source = "amount", target = "amount", qualifiedByName = "roundDouble")
    @Mapping(source = "amountVat", target = "amountVat", qualifiedByName = "roundDouble")
    @Mapping(source = "vatPercentage", target = "vatPercentage", qualifiedByName = "roundDouble")
    InvoiceDTO toDto(Invoice invoice);

    @Named("roundDouble")
    default Double roundDouble(Double d) {
        return CommonUtil.round(d, 2);
    }
}
