from .serializer import *
from .models import *

from statistic_utils import Statistic, StatisticDetail
import pprint

class Order(Statistic):
	"""
	[count] : Purchases by time & day & month & week.

	[drink_order] : Drinks ordered by time & day & month & week.

	[income_order] : Income by time & day & month & week.
	"""
	queryset = Order.objects.all()
	def get_statistic(self, subject, units, **kwargs):
		context = {}
		context['drink_order'] = "queryset.aggregate(Sum('products__quantity'))['products__quantity__sum']"
		context['income_order'] = "queryset.aggregate(Sum('amount'))['amount__sum']"
		return super(Order,self).get_statistic(subject, units, **context)

class UserLog(Statistic):
	"""
		Users logged in by time & day & month & week 
	"""
	queryset = UserLog.objects.all()

class UserPurchase(StatisticDetail):
	"""
		Per user - time, date, week, month, year the purchases happen. 
	"""
	queryset = UserBase.objects.all()

	def get_queryset(self):	
		return self.queryset.orders.all()