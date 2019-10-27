import assert from "assert"
import { transform, ignoreWhitespace } from './helper'

describe("Stricter jsx transformation", () => {
  it("converts a self-closing html tag without attributes", () => {
    const input = `<div />`

    const expectedOutput = `React.createElement("div", null);`

    assert.equal(
      ignoreWhitespace(transform(input).code),
      ignoreWhitespace(expectedOutput)
    )
  })

  it("converts a self-closing html tag with string attributes", () => {
    const input = `<div class="foo" onClick="javascript:void(0)" />`

    const expectedOutput = `React.createElement("div", {
      class: "foo",
      onClick: "javascript:void(0)"
    });`

    assert.equal(
      ignoreWhitespace(transform(input).code),
      ignoreWhitespace(expectedOutput)
    )
  })

  it("converts a open/close html tag with values and attributes", () => {
    const input = `<div class="foo">Foo</div>`

    const expectedOutput = `React.createElement("div", {
      class: "foo"
    }, "Foo");`

    assert.equal(
      ignoreWhitespace(transform(input).code),
      ignoreWhitespace(expectedOutput)
    )
  })

  it("allows namespacing in xml by default", () => {
    const input = `<homepage xlink:type="simple" xlink:href="https://www.w3schools.com" />`
    const expectedOutput = `React.createElement("homepage",{
      "xlink:type" : "simple",
      "xlink:href" : "https://www.w3schools.com"
    });`
    let output
    assert.doesNotThrow(() => {
      output = transform(input)
    })
    assert.equal(ignoreWhitespace(output.code), ignoreWhitespace(expectedOutput))
  })

  it("does not allow assignment within jsx", () => {
    const input = `
      <div>
        { a = "a" }
      </div>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("does not fat arrow functions within jsx", () => {
    const input = `
      <div>
        { (foo) => { return foo + 2 } }
      </div>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("allows nested member expressions interpolation", () => {
    const input = `
      <a>{ foo.bar.zardoz }</a>
    `
    const expectedOutput = `React.createElement("a", null, foo.bar.zardoz);`
    assert.equal(
      ignoreWhitespace(transform(input).code),
      ignoreWhitespace(expectedOutput)
    )
  })

  it("does not allow member calls", () => {
    const input = `
      <a>{ foo.bar.zardoz() }</a>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("does not allow interpolated expressions", () => {
    const input = `
      <a>{ 1 + 1 }</a>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("does not allow ternary expressions", () => {
    const input = `
      <a>{ foo ? "foo" : "bar" }</a>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("does not allow logical && statements for conditional-ing", () => {
    const input = `
      <a>{ isTwo && "2" }</a>
    `
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("does not allow templates", () => {
    const input = "<a>{ `1-${way}` }</a>"
    assert.throws(() => { transform(input) }, { message: /no logic/})
  })

  it("allows logic outside of a jsx tag to pass", () => {
    const input = `
      import thing from "./thing"
      export default thing() + 3 
    `
    assert.doesNotThrow(() => { transform(input) })
  })

  it("allows nested jsx", () => {
    const input = `
      <section class='user-detail'>
        <div class="first-name">{ name.first }</div>
        <div class="last-name">{ lastName }</div>
        <div class="email">{ email }</div>
        <div class="phone">{ phone }</div>
        <a href={ editLink }>Edit</a>
      </section>
    `

    assert.doesNotThrow(() => { transform(input) })
  })
})