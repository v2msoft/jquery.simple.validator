# jquery.simple.validator
#### Easy, lightweight and customizable jquery validator.


### Description

It's a plugin for jQuery that performs easy client-side validation compatible with all frameworks (PHP, ASP, ASP.Net, Java...).
The difference with other validators is that this plugin can perform validation in any HTML container such a form, div, fieldset, table, span, ....

### Validations
* Possibility to show error next to field or error summary.
* Possibility to validate on click or autovalidate when leave field (onblur).
* Error CSS customization up to the user.
* Email validator
* IBAN validator
* Required field validator
* Dates validator (with format definition)
* Drowdown element selected validator
* Numbers validator
* Radio elements should be selected validator
* Easy way to create a custom validator
* Validate a group of fields, or just a single field.


### External example

[External easy example](https://cdn.rawgit.com/v2msoft/jquery.simple.validator/master/jquery.validator.testpage.html)

### Dependencies

jQuery 1.7 or higher

### Compatibility
* PHP, JSP, Servlets, Java, Ruby, Python, GoLang...
* Other jQuery plugins
* ASP.Net Web Forms, yes no problem with the single-form-architecture of asp.net because you can use other html containers than <form>
### How to include
```html
<head>
    <script type="text/javascript" src="/Content/js/jquery-plugins/jquery.simple.validator.js"></script>
</head>
```

### How to use it
Just use the `data tag` standard, that is based on set `data-XXXX` where XXXX is the operation you want and `data-XXXX-msg` with the message you want.
By default, the validator plugin creates a new span after the control with the error message. When the error is corrected, the control dissapears.

**Required field validator**

`data-required`: Indicates the field is required

`data-required-msg`: Error message 

**Specific error message control**

`data-message-control` Id of the html control where to show the message. Can be applied in all fields.

**Skip validation on a field**

`data-disable-validation` The control with that tag, will not be validated

**Only numbers accepted**

`data-only-numbers`: The element should only have numbers ( , . - )

`data-only-numbers-msg`: Error message

**Date format**

`data-date-format`="dd/MM/yyyy"

`data-date-format-separator`="/"

`data-date-format-msg`: Error message

**Drop down value not selected**

`data-select-value-different`="0"    //You have to select an index different than 0
`data-select-value-different-msg: Error message

**IBAN format**

`data-iban`:  Validates IBAN Bank format

`data-iban-msg`:  Error message

**Email**

`data-email`: Validates valid email entry

`data-email-msg`: Error message

**Input radio**

`data-radio-selected`: The radio button should have a value selected or checked

`data-radio-selected-msg`: Error message

### Methods
`$(#container).initialize(options)` Initialize the plugin with the specified options. If no options passed, will use default options.

`$(#container).validate()` Start all validations

`$(#field_name).validateField()` Validate just the specified field.

`$(#container).registerValidator(validator_name,validation_function)` Register a custom made validator

**Other helper methods**

`$(#field_name).isEmail()`: Email format is valid

`$.isEmail("string_email")`: Email format is valid

`$(#field_name).isEmpty()`: No data introduced in field

`$.isEmpty("string to check")`: No data introduced in field

### By example
```html
<script type="text/javascript" src="/Content/js/jquery-plugins/jquery.simple.validator.js"></script>

<div id="container">
    <!-- REQUIRED FIELD -->
    <label>Required Field: </label><br/>
    <input type="text" id="required_field_control" data-required data-required-msg="Field is required" /><br /><br/>

    <input type="button" value="Validate" onclick='javascript:validate();' />
</div>


<script type="text/javascript">
    function validate() {
        $("#container").initialize();
        var ok = $("#container").validate();
        if (!ok)  alert("There are errors");
        else alert("Form is ok");
    }
</script
```


### All validators example
```html
<!-- REQUIRED FIELD -->
<label>Required Field: </label><br/>
<input type="text" id="required_field_control" data-required data-required-msg="Field is required" /><br /><br/>
```

```html
<!-- EMAIL VALIDATION -->
<label>EMAIL: </label><br />
<input type="email" id="email" data-email data-email-msg="Email is not correct"  /><br /><br />
```

```html
<!-- ONLY NUMBERS -->
<label>Only Numbers (Accepts . , -): </label><br />
<input type="text" id="phone" data-only-numbers data-only-numbers-msg="You should put only numbers" /><br /><br />
```

```html
<!-- DATE FORMAT VALIDATOR -->
<label>Date format (dd/mm/yyyy): </label><br />
<input type="text" id="date" data-date-format="dd/MM/yyyy" data-date-format-separator="/" data-date-format-msg="The date format is not correct" /><br /><br />
```

```html
<!-- select a value -->
<select id="select" data-select-value-different="0" data-select-value-different-msg="You should select a value">
    <option value="0">Select a value</option>
    <option value="1">First value</option>
</select><br/><br />
```

```html
<!-- IBAN VALIDATION -->
<label>IBAN: </label><br />
<input type="text" id="iban" data-iban data-iban-msg="IBAN format is not correct" value=""  /><br /><br />
```

```html
<!-- REQUIRED FIELD with message in specific control -->
<label>Required Field with message in specific control: </label><br />
<input type="text" id="emailse" data-required data-required-msg="Field is required in specific error" data-message-control="specificError"/><br /><br />
<span style="color:orangered;" id="specificError"></span><br/><br/>
```

```html
<!-- REQUIRED FIELD VALIDATION DISABLED -->
<label>Required Field with validation disabled: </label><br />
<input type="text" id="required_field_control" data-required data-required-msg="Field is required" data-disable-validation /><br /><br />
```

```html
<!-- Radio -->
<label>Radio should be selected: </label><br />
<input type="radio" id="radio-control" data-radio-selected data-radio-selected-msg="You should select a radio option" data-message-control="specificErrorRadio" value="1" /> Option 1<br />
<input type="radio" id="radio-control" value="2" /> Option 2<br />
<span style="color:orangered;" id="specificErrorRadio"></span><br />
```

### Configurations
`errorClass` (string) Css class of the error message is going to be shown. *(by default: validator_error)*

`scrollToFirstError` (true|false) When errors are processed, scroll automatically the page till the first error. *(by default true)*

`scrollToFirstElementTime` (integer) Speed in milliseconds of ths scroll *(by defualt, 1000)*

`scrollToFirstElementOffset` (integer) Offset in pixels of the scroll, to leave a margin when scrolling *(by default 0)*

`debug` (true|false) Show validation status in developer console *(by default false)*

`dataDynamicRevalidate` (true|false) Autovalidate fields when blur *(by default false)*

`validationSummary` (true|false) Activate if you want to show the errors in a central spot  *(by default false)* 

`validationSummaryControl` (string) The id of the control where to show the summary

How to set the options:

```javascript
$("#container").initialize({ 
    debug: true, 
    errorClass: 'my_css_error_class', 
    scrollToFirstError: true,
    scrollToFirstElementOffset : 100});
```

### How to define your own custom validators or custom errors
The method registerValidator() receives 2 parameters
* data-tag-validator-name:
* function that performs validation. The functions receives as a parameter a jQuery object with the field that is being validated. Has to return true if validation is OK, or false if there is an error.

Example:

```javascript
$("#container").initialize();

$("#container").registerValidator("data-personal-validator",
    function (control) {
        if (control.val() == "ok") return true;
        else return false;
    });

var ok = $("#container").validate();
```

### How to validate just a field

```javascript
    $("#field_id").initialize();
    var ok = $("#field_id").validateField();
```
