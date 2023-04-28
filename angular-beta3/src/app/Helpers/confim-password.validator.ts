import { FormGroup } from "@angular/forms";

export function confimPasswordValidator(conrolName:string, matchControlName:string){
    return (formGroup:FormGroup)=>{
        const passwordControl=formGroup.controls[conrolName];
        const confimPasswordControl=formGroup.controls[matchControlName];
        if(confimPasswordControl.errors && confimPasswordControl.errors['confimPasswordValidator']){
            return;
        }
        if(passwordControl.value !== confimPasswordControl.value){
            confimPasswordControl.setErrors({confimPasswordValidator:true})
        } else{
            confimPasswordControl.setErrors(null);
        }
    }
}