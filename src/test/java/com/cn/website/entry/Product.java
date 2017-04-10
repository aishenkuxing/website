package com.cn.website.entry;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "Product")
public class Product {
	@Id
    @Basic
    private Integer id;

    @Basic
    private String sku;

    private String name;

    @Basic
    private String description;
}
