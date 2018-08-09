from haystack import indexes
from .models import Drink

class DrinkIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True,
         template_name='search/indexes/Manager/product_text.txt')
    name = indexes.CharField(model_attr="name", null=True)
    key_word = indexes.CharField(model_attr="key_word", null=True)

    autocomplete = indexes.EdgeNgramField()

    @staticmethod
    def prepare_autocomplete(obj):
        # check if not none
        ret = filter(lambda x: x != None and x != '', 
                (obj.name, obj.key_word))
        
        return " ".join(ret)
    def get_model(self):
        return Drink

    def index_queryset(self, using=None):
        return self.get_model().objects.all()