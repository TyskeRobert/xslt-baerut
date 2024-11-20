# Using XSLT to create JSON-based text editions from TEI XML
**Workshop: Getting started with XSLT** (Oslo, 20 Nov 2024) **BærUt-nettverket**

## Description

This repository contains the code necessary to participate in workshop session 3 on 20 Nov 2024.

Clone the repository and open it with VS Code. Run *Go Live* to open it in your system browser.

## Software requirements

* Oxygen XML-editor ([free trial version](https://www.oxygenxml.com/xml_editor/register.html?p=editor))
* A modern web-browser (e.g. [Google Chrome](https://www.google.com/chrome/), [Mozilla Firefox](https://www.mozilla.org/en-US/firefox/new/))
* Code Editor [VS Code](https://code.visualstudio.com/) with extension *Live Server*

## Presentation

### What is JSON?

* **JSON**: **J**ava**S**cript **O**bject **N**otation
* Text-based, self-describing format for storing and organizing data (like XML)

#### Data types

* String - a chain of unicode characters, delimited by double-quotes: `"Ut på tur, aldri sur."`.
* Number - An integer, decimal or exponential number, not delimited: `1`, `2`, `135`, `-5`, `0.71`, `6.022e23`.
* Boolean - `true` or `false`
* Array (list) - an ordered list of items of any type, separated by comma, delimited by **square** brackets, e.g.
  * the same type: `["eenie", "meenie", "minee", "moe"]`
  * mixed: `["one", 1, false, {"age": 25}, ["eins", "zwei", "drei"]]`
* Object (map) - an unordered collection of key-value pairs, separated by comma, delimited by **curly** braces, e.g.
  * each key and value are separated by a colon
  * any key has to be a string
  * each key has to be unique within the object
  * the values can be of any data type, e.g.
```json
{
  "event": "Getting started with XSLT",
  "date": "2024-11-20",
  "participants": [
    {
      "name": "Robert",
      "age": 40,
      "interests": [
        "Historical Linguistics",
        "JSON",
        "Lego"
      ]
    },
    {
      "name": "Patrick",
      "age": 32,
      "interests": [
        "Music",
        "Brasilian Jiu Jitsu",
        "Old Norse"
      ]
    }
  ]
}
```
* `null`

White-space is irrelevant outside of strings - so it may be used freely for indentation to make the file more readable.

A JSON file consists of only item (most commonly and sensibly an object or an array).

### JSON vs XML for text editions



### Synthesis
