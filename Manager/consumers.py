
from pprint import pprint
from channels.generic.websockets import JsonWebsocketConsumer

class StatisticConsumer(JsonWebsocketConsumer):

    def connect(self, message, **kwargs):
        self.send("Connect to statistic successfull!")

    def receive(self, content, **kwargs):
        """
        Called when a message is received with decoded JSON content
        """
        # Simple echo
        self.send(content)

    def disconnect(self, message, **kwargs):
        """
        Perform things on connection close
        """
        pass