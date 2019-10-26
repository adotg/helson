# Helson

## Todo

[x] Support of truthy and falsy value

[x] Remove OPTIONAL from `type_key` and put it with `pairs`

[x] Remove DepGraph if it's not required

[ ] Is documentation generation can be done

[ ] Correct error message during tokenizing + parsing

[~] Diff when matching an object to regulator

[ ] For an enum the value has to be absolute, right now general allowed syntax for general objects are also parsed

[ ] Right now OList supports optional key word as a preProcessor. For an OList optionality is cann't be handled.

[ ] Throw proper error during tokenizing / parsing / transformation phrase

[ ] Support for nullable

## Note

- Decimals will be in the form of 0.1234. The prefix zero is mandatory.
- The name of the types always start with a capital letter
- The value of a complex enum should go in one line other wise the tokenizer messes up
