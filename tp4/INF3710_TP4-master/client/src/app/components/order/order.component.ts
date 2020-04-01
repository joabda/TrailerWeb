import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditCard } from 'src/app/interfaces/cc';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent {

  firstName: string = '';
  lastName: string = '';
  ccv: string = '';
  private ccNumber: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ref: MatDialogRef<OrderComponent>,
    private snacks: MatSnackBar
  ) { 
    this.ccNumber =  this.data.cc[0].cardNumber;
  }

  close(): void {
    this.ref.close({buy: false});
  }

  ccChange(event: Event): void {
    this.ccNumber = this.data.cc[(event.target as HTMLSelectElement).selectedIndex].cardNumber;
  }

  submit(): void {
    let card: CreditCard = null as unknown as CreditCard;
    for(const element of this.data.cc) {
      if(element.cardNumber === this.ccNumber) {
        card = element;
      }
    }
    if(
      card                          !== null            &&
      this.firstName.toLowerCase()  === card.firstName  &&
      this.lastName.toLowerCase()   === card.lastName   && 
      this.ccv                      === card.cvc.toString()
    ) {
      this.ref.close({buy: true});
    } else {
      this.snacks.open(
        'Invalid Information!', 
        "", 
        {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'center'
        }
      );
    }
  }

  filter(cc: number): string {
    const ccString = cc.toString();
    return `****-****-****-${ccString.substring(ccString.length - 4)}`;
  }
}
