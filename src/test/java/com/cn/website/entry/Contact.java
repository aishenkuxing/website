package com.cn.website.entry;

import javax.persistence.Entity;
import javax.persistence.Id;

import org.hibernate.validator.constraints.URL;

@Entity(name = "Contact")
public class Contact {
	
	@Id
    private Integer id;

    private String name;

    private String notes;

    private URL website;

    private boolean starred;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNotes() {
		return notes;
	}

	public void setNotes(String notes) {
		this.notes = notes;
	}

	public URL getWebsite() {
		return website;
	}

	public void setWebsite(URL website) {
		this.website = website;
	}

	public boolean isStarred() {
		return starred;
	}

	public void setStarred(boolean starred) {
		this.starred = starred;
	}
    
}
