#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Michael McAssey'
SITENAME = 'Portfolio - Michael McAssey'
# SITEURL = 'https://michaelpm54.github.io'

PATH = 'content'

TIMEZONE = 'Europe/Paris'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None

# Blogroll
LINKS = (('GitHub', 'https://github.com/michaelpm54/'), ('#', '#'))

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
#RELATIVE_URLS = True

PLUGINS = ['pelican_katex']

STATIC_PATHS = [
	'images',
	'html',
	'js',
	'css',
]

ARTICLE_EXCLUDES = ['html']
