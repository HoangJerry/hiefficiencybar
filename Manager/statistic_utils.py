from django.db.models import Q, Sum, Count

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status, exceptions, permissions, viewsets, mixins
from rest_framework.permissions import BasePermission, IsAdminUser
import api_utils

class Statistic(APIView):
	year = None
	month = None
	day = None
	"""
		Statistic by year, month, day time
		GET method with ? year=&month=
	"""
	def get_queryset(self):
		queryset = self.queryset
		return queryset

	def get_context_data(self, queryset, **kwargs):
		data = {}
		for key in kwargs:
			data[key] = eval(kwargs[key]) if eval(kwargs[key]) else 0
		return data	

	def get_statistic(self, subject, units, **kwargs):
		ret = {}
		ret['result']=[]
		if self.year:
			format_unit = "{}-".format(self.year) 
		if self.month:
		 	format_unit = "{}{}-".format(format_unit,self.month)
		if self.day:
			format_unit = "{}{}-".format(format_unit,self.day)

		for unit in units:
			data = {}
			data["datetimes"]="{}{}".format(format_unit, unit)
			# data[subject]="{}{}".format(format_unit, unit)
			queryset = eval('self.queryset.filter(creation_date__{}={})'.format(subject,"unit"))
			if self.year:
				queryset = queryset.filter(creation_date__year=self.year)
			if self.month:
				queryset = queryset.filter(creation_date__month=self.month)
			if self.day:
				queryset = queryset.filter(creation_date__day=self.day)
			data['count']=queryset.count()
			data.update(self.get_context_data(queryset,**kwargs))
			ret['result'].append(data)
		return ret

	def get(self, request, *args, **kwargs):
		try:
			year = request.GET.get('year',None)
			if not year:
				years = [d.year for d in self.queryset.all().datetimes('creation_date','year')]
				return Response(self.get_statistic('year',years))
			else:
				self.year = year
				month = request.GET.get('month',None)
				if not month:
					months = [d.month for d in self.queryset.filter(creation_date__year=year).datetimes('creation_date','month')]
					return Response(self.get_statistic('month',months))
				else:
					self.month = month
					day = request.GET.get('day',None)
					if not day:
						days = [d.day for d in self.queryset.filter(creation_date__year=year,creation_date__month=month).datetimes('creation_date','day')]
						return Response(self.get_statistic('day',days))
					else:
						self.day = day
						hours = [d.hour for d in self.queryset.filter(creation_date__year=year,creation_date__month=month,creation_date__day=day).datetimes('creation_date','hour')]
						return Response(self.get_statistic('hour',hours))
		except Exception as e:
			raise api_utils.InternalServerError("don't have creation_date field")
		
class StatisticDetail(Statistic):
	def get(self, request, *args, **kwargs):
		try:
			self.queryset = self.queryset.get(pk=kwargs['pk'])
		except Exception as e:
			raise e
		try:
			self.queryset = self.get_queryset()
		except Exception as e:
			raise api_utils.InternalServerError("get_queryset not provide, or don't have creation_date field")
		return super(StatisticDetail,self).get(request, *args, **kwargs)
