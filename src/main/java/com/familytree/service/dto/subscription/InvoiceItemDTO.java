package com.familytree.service.dto.subscription;

public class InvoiceItemDTO {

    private String number;
    private String itemAr;
    private String amount;
    private String vat;
    private String total;

    public String getItemAr() {
        return itemAr;
    }

    public void setItemAr(String itemAr) {
        this.itemAr = itemAr;
    }

    public String getNumber() {
        return number;
    }

    public void setNumber(String number) {
        this.number = number;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public String getVat() {
        return vat;
    }

    public void setVat(String vat) {
        this.vat = vat;
    }

    public String getTotal() {
        return total;
    }

    public void setTotal(String total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return (
            "InvoiceItemDTO{" +
            "number='" +
            number +
            '\'' +
            ", itemAr='" +
            itemAr +
            '\'' +
            ", amount='" +
            amount +
            '\'' +
            ", vat='" +
            vat +
            '\'' +
            ", total='" +
            total +
            '\'' +
            '}'
        );
    }
}
