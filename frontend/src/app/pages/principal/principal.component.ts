import { LoginComponent } from './../login/login.component';
import { Apollo, gql } from 'apollo-angular';
import { PrincipalService } from './../../services/principal/principal.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';

const addText = gql`
  mutation AddText($content: String!, $id: String!, $nameOp: String!)
  {
    addText(content: $content, id: $id, nameOp: $nameOp)
    {
      user
      {
        text
        {
          operation
          {
            resultOp
          }
        }
      }
    }
  }
`;


@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.scss']
})

export class PrincipalComponent implements OnInit {

  Data: Array<any> = [
  { name: ' Tokenization تقطيع الجملة', value: 'Tokenization' },
  { name: ' Stop Words المستبعدات' , value: 'Stop Words' },
  { name: 'Lemmatization المدخل المعجمي', value: 'Lemmatization' },
  { name: 'Stemming أصل الكلمة', value: 'Stemming' },

 ];

 form: FormGroup;
 result: any;

  serv: String ="";
  res: any;
  rslt: any;
 


  constructor(private fb: FormBuilder, private apollo: Apollo) {
  this.form = this.fb.group({
    checkArray: this.fb.array([]),
    myText: new FormControl('', Validators.required)
  })
}

  ngOnInit(): void {}

  onCheckboxChange(e: any) {
    const checkArray: FormArray = this.form.get('checkArray') as FormArray;

    if (e.target.checked) {
      checkArray.push(new FormControl(e.target.value));
    } else {
      let i: number = 0;
      checkArray.controls.forEach((item: AbstractControl) => {
        if (item.value == e.target.value) {
          checkArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  submitForm(){
    console.log("text : " + LoginComponent.id )
     this.apollo.mutate({
      mutation: addText,
      variables: {
        content: this.form.value.myText,
        id: LoginComponent.id,
        nameOp: this.form.value.checkArray
      }
    }).subscribe(({data}) => {

      this.res = data
      let l = this.res['addText']['user']['text'].length
      let k = this.res['addText']['user']['text'][l-1]['operation'].length

      let ct = this.res['addText']['user']['text'][l-1]['operation'][k-1]['resultOp']

      this.rslt = ct
      this.result = this.rslt
      console.log("data : "+this.rslt)
      }, (error) => {
        console.log('Error : ' , error)
      });

  }

  nlp(event : any){
    this.apollo.mutate({
      mutation: addText,
      variables: {
        content: this.form.value.myText,
        id: LoginComponent.id,
        nameOp: "nlp"
      }
    }).subscribe(({data}) => {

      this.res = data
      console.log(this.res)
      let l = this.res['addText']['user']['text'].length
      let k = this.res['addText']['user']['text'][l-1]['operation'].length

      let ct = this.res['addText']['user']['text'][l-1]['operation'][k-1]['resultOp']

      this.rslt = ct
      this.result = this.rslt
      console.log("data : "+this.rslt)
      }, (error) => {
        console.log('Error : ' , error)
      });

  }



}
