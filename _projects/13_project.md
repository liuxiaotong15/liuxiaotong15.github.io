---
layout: post
title: 2026
description: 2026年6月24日 北信科小营校区
event_date: 2026-06-24
img: assets/img/graduates/2026/cover.svg
importance: -3
category: graduates
related_publications: false
images:
  lightbox2: true
  photoswipe: true
  spotlight: true
  venobox: true
---

2026年6月24日，小营校区毕业合影。

照片上传文件夹：`assets/img/graduates/2026/`

## 集体合影（点击图片放大）

{% assign graduate_2026_files = site.static_files | where_exp: "file", "file.path contains '/assets/img/graduates/2026/'" | sort: "name" %}
{% assign graduate_2026_count = 0 %}

{% for photo in graduate_2026_files %}
{% unless photo.path contains '/thumbs/' %}
{% if photo.extname == '.jpg' or photo.extname == '.jpeg' or photo.extname == '.png' or photo.extname == '.webp' or photo.extname == '.gif' %}
{% assign graduate_2026_count = graduate_2026_count | plus: 1 %}
<a href="{{ photo.path | relative_url }}" data-lightbox="roadtrip"><img src="{{ photo.path | relative_url }}" /></a>
{% endif %}
{% endunless %}
{% endfor %}

{% if graduate_2026_count == 0 %}
照片待上传。请把照片放到 `assets/img/graduates/2026/`，页面会自动列出该文件夹下的 jpg、jpeg、png、webp、gif 图片。
{% endif %}
