from channels.generic.websockets import WebsocketDemultiplexer
from channels.routing import route_class
from channels.routing import route
from Manager import consumers
from Manager.bindings import OrderBinding

class OrderDemultiplexer(WebsocketDemultiplexer):

    consumers = {
      'orders': OrderBinding.consumer
    }

channel_routing = [	
    # consumers.StatisticConsumer.as_route(path=r"^/statistic/$"),
    route_class(OrderDemultiplexer),
]
