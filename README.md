# babel-plugin-transform-jssx

Transforms jsx into a stricter form, raising errors when there is JS logic in the xml.
Nested member calls are law of demeter violations, but whatever.

```jsx
<Thing className={className} />
  <Thang>{ thing.thang.name }</Thang>
</Thing>
```

Calling methods, or adding logic in the js interpolation is forbidden

```jsx
<Thing className={className()} /> // FAIL, because no method calls!
  <Thang>{ thing.thang && thing.thang.name }</Thang> // FAIL, because no logic!
</Thing>
```

## But why?

Since the dawn of JSX, I've been working as a consultant or engineering leader with the goal of getting the teams to get to or stay at high velocity. Working in maintainable code with good patterns for getting things done has been key.

Mixing logic with templates starts out fine, and quickly becomes an unmaintainable mess. This plugin is like a high-octane linter that won't even compile with logic mixed into the xml.

## Install

```sh
npm install --save-dev https://github.com/baccigalupi/babel-plugin-transform-jssx.git
```

This should be used instead of the normal React jsx tranform plugin.

## Usage

In your `.babelrc`, add: 

```json
"plugins": [
  "babel-plugin-transform-jssx"
]
```