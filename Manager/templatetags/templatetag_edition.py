from django import template
from datetime import timedelta

register = template.Library()

@register.filter(name='parseToTime')
def parseToTime(value):
    return u'{}:{}'.format(value/60,value%60)