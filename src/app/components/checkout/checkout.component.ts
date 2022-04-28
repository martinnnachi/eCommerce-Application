import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {Country} from 'src/app/common/country';
import {Luv2ShopFormService} from "../../services/luv2-shop-form.service";
import {State} from "../../common/state";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup

  totalPrice: number = 0
  totalQuantity: number = 0

  creditCardYears: number[] = []
  creditCardMonths: number[] = []

  countries: Country[] = []

  shippingAddressStates: State[] = []
  billToAddressStates: State[] = []

  constructor(private formBuilder: FormBuilder, private luv2ShopFormService: Luv2ShopFormService) {
  }

  ngOnInit(): void {

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        postalCode: [''],
        country: [''],
        state: ['']
      }),
      billingAddress: this.formBuilder.group({
        street: [''],
        city: [''],
        postalCode: [''],
        country: [''],
        state: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityNumber: [''],
        expiryMonth: [''],
        expiryYear: ['']
      })
    })

    // populate credit card months
    // @ts-ignore

    const startMonth: number = new Date().getMonth() + 1
    console.log("startMonth: " + startMonth)

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data
      }
    )

    // populate credit card years

    this.luv2ShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data))
        this.creditCardYears = data
      }
    )

    // populate countries
    this.luv2ShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved countries: " + JSON.stringify(data))
        this.countries = data
      }
    )

  }

  copyShippingAddressToBillingAddress(event) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value)

      // bug fix for states
      this.billToAddressStates = this.shippingAddressStates

    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset()

        // bug fix for states
      this.shippingAddressStates = []
    }
  }

  onSubmit() {
    console.log("Handling the submit button")
    console.log(this.checkoutFormGroup.get('customer').value)
    console.log("The email address is: " + this.checkoutFormGroup.get('customer').value.email)

    console.log("The shipping address country is: " + this.checkoutFormGroup.get('shippingAddress').value.country.name)
    console.log("The shipping address state is: " + this.checkoutFormGroup.get('shippingAddress').value.state.name)

  }

  handleMonthsAndYears() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    // @ts-ignore
    const currentYear: number = new Date().getFullYear()
    const selectedYear: number = Number(creditCardFormGroup.value.expiryYear)

    // if the current year equals the selected year, then start with the current month

    let startMonth: number

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1
    } else {
      startMonth = 1
    }

    this.luv2ShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.creditCardMonths = data
      }
    )


  }

  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName)

    const countryCode = formGroup.value.country.code
    const countryName = formGroup.value.country.name

    console.log(`${formGroupName} country code: ${countryCode}`)
    console.log(`${formGroupName} country name: ${countryName}`)

    this.luv2ShopFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data
        } else {
          this.billToAddressStates = data
        }

        // select the first state as the default
        formGroup.get('state').setValue(data[0])
      }
    )
  }
}
