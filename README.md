# jquery.simple.validator
#### Easy, lightweight simple jquery validator.


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
* Easy way to create a custom validator
* Validate a group of fields, or just a single field.

### Dependencies

jQuery 1.7 or higher

### How to include
```html
<head>
    <script type="text/javascript" src="/Content/js/jquery-plugins/jquery.simple.validator.js"></script>
</head>
```

### How to use it
Just use the `data tag` standard, that is based on set `data-XXXX` where XXXX is the operation you want and `data-XXXX-msg` with the message you want.

**Required field validator**

`data-required`: Indicates the field is required

`data-required-msg`: Error message 

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
        var ok = $("#container").validate();
        if (!ok)  alert("There are errors");
        else alert("Form is ok");
    }
</script
```


### By detailed example
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
