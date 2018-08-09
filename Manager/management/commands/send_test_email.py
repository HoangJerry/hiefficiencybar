from django.core.management.base import BaseCommand, CommandError
from django.db.models import Q
from django.utils import timezone
from django.template.loader import render_to_string

from Manager import tasks

class Command(BaseCommand):
    help = 'Test sending email with email "ngochoang09121996@gmail.com"'

    # def __init__(self, *args, **kwargs):
    #     super(Command, self).__init__(*args, **kwargs)

    def handle(self, *args, **options):
        subject = 'Hi-Effeciency - Testing send email'
        html_content = render_to_string('email/new_order_receipt.html')
        tasks.send_email(subject, html_content, ['ngochoang09121996@gmail.com','vietndpd01144@gmail.com'])
        # print "The email has been sent, please check after few minutes."
        self.stdout.write('The email has been sent, please check after few minutes.')
        # for product in products:
        #     self.stdout.write('\nProcessing product %d - "%s"' % (product.id, product.title))

        #     bet = product.draw_winners()

        #     if bet is None:
        #         self.stderr.write(' !! No bet on the product. Cannot draw the winner!')
        #     else:
        #         self.stdout.write(' => Winner %s (ID: %d) with winner number %d' % 
        #                 (bet.user.get_full_name(), bet.user_id, bet.number))

