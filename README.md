# The Button

![](/screenshots/preview.png)

## Use `<button>`

Please don't use `<a>` for buttons. They have different meaning and behaviour. Link responses to <kbd>Enter</kbd> key (will trigger onClick action), button reponses to <kbd>Space</kbd>. If user focuses on `<a>`, which is styled as button and uses <kbd>Space</kbd> page will be scrolled instead of action. `<a>` used for navigation, user can <kbd>Ctrl</kbd>/<kbd>Cmd</kbd> click it, to open in new tab. `<a>` is not focusable in Firefox. What I try to say `<a>` and `<button>` has quite big difference in behaviour and semantics.

You should be able to use `<button>` everywhere, but if you want something else you can use `<div role="button" tabindex=0>` as well. There is `<input type="button" />` if you want something old-school.

```jsx
<button>
  <span role="img" aria-label="unicorn">
    🦄
  </span>{" "}
  Button
</button>
```

## Reset styles

`<button>` comes with predefined styles, but if we want to customize it we can start with resetting styles

```css
/* reset button styles https://css-tricks.com/overriding-default-button-styles/ */
button {
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  /* not needed in modern browsers */
  -webkit-appearance: none;
  -moz-appearance: none;
}
```

![](/screenshots/1.png)

## Initial style

Let's make our button look like a button

```jsx
<button className="button">
```

```css
/* inspired by https://codepen.io/liamj/pen/vvdRdR */
.button {
  --color-dark: #333;
  --color-light: #fff;
  display: block;
  position: relative;
  font-size: 2rem;
  padding: 1rem 2rem;
  border-radius: 0.4rem;
  background: var(--color-light);
  color: var(--color-dark);
  border: 0.2rem solid var(--color-dark);
  box-shadow: 0 0.2rem 0 0 var(--color-dark);
}
```

![](/screenshots/2.png)

## Active state

The button should provide active state, so a user would know that the button responds to click.

```css
.button:active {
  top: 0.2rem;
  box-shadow: none;
}
```

![](/screenshots/3.png)

## Disabled state

The button should provide disabled state, so a user would know that button is not clickable.

```jsx
<button className="button" disabled>
```

```css
.button:disabled {
  --color-dark: #999;
  cursor: not-allowed;
}
```

![](/screenshots/4.png)

Almost there, but Emoji doesn't change color.

```css
.button:disabled {
  --color-dark: #999;
  cursor: not-allowed;
  /* see https://www.bram.us/2016/10/06/emoji-silhouettes-and-emoji-outlines-with-css/ */
  color: transparent;
  text-shadow: 0 0 0 var(--color-dark);
}
```

![](/screenshots/5.png)

## Focus state

The button should provide a focused state, so a user would know where is the focus, otherwise, the user would need to guess or tab to closest element which provides focus. There is a focus state out of the box provided by the browser:

Chrome:

![](/screenshots/6.png)

Firefox:

![](/screenshots/7.png)

Safari:

[In Safari buttons are not "tapable"](https://allyjs.io/data-tables/focusable.html) :facepalm:

### Customize focus state

Let's remove default focus state:

```css
/* https://fvsch.com/styling-buttons/ */
.button:focus {
  outline: none;
}
.button::-moz-focus-inner {
  border: none;
}
```

**Don't remove the outline unless you provide alternative**

Let's add custom outline:

```css
.button:focus {
  outline: none;
  box-shadow: 0 0.2rem 0 0 var(--color-dark), 0 2px 5px 3px #f0f;
}
```

![](/screenshots/8.png)

### Focus state + active

Because we use `box-shadow` for both `:active` and `:focus` they can conflict and we need to take care of special case:

```css
.button:active:focus {
  top: 0.2rem;
  box-shadow: 0 0px 6px 4px #f0f;
}
```

![](/screenshots/9.png)

### Focus state for keyboard users only

There is no need to show focus for mouse users, it is only useful for keyboard users. So there is a proposal to add [`:focus-visible`](https://drafts.csswg.org/selectors/#the-focus-visible-pseudo) state to do that. Meantime we can use a polyfill or implement this functionality ourselves.

```js
import "focus-visible";
```

```css
.js-focus-visible :focus:not(.focus-visible) {
  box-shadow: 0 0.2rem 0 0 var(--color-dark);
}
.js-focus-visible :active:not(.focus-visible) {
  top: 0.2rem;
  box-shadow: none;
}
```

## Touchscreen

The touchscreen has special requirements for buttons as well

### Minimum size

According to many sources ([1](https://www.nngroup.com/articles/touch-target-size/), [2](https://developer.apple.com/design/tips/), [3](https://docs.microsoft.com/en-us/windows/uwp/design/input/guidelines-for-targeting)) size of button on touch devices should be about 1cm.

```css
button {
  min-width: 1cm;
  min-height: 1cm;
}
```

As well there should be enough space around adjacent buttons to prevent wrong button clicks.

### Active state for touchscreen

When the user taps the button on touch device they cover the button with the finger, so they can't see the active state of the button. So they need a special active state which will be visible sometime after they take off the finger. For example, the Material design uses a ripple effect for this.

```css
button {
  user-select: none;
  /* we need to remove built in effet */
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
```

Let's create our own after tap effect

```css
/* https://css-tricks.com/touch-devices-not-judged-size/ */
@media (hover: none) {
  /* inspired by https://codepen.io/numerical/pen/XJKeop */
  .button ::after {
    content: "";
    display: block;
    height: 100px;
    position: absolute;
    transform: translate3d(-150%, -50px, 0) rotate3d(0, 0, 1, 45deg);
    width: 200px;
  }

  .button.active ::after {
    background-image: linear-gradient(
      to top,
      rgba(255, 0, 255, 0.1),
      rgba(255, 0, 255, 0.9)
    );
    transition: all 2.2s cubic-bezier(0.19, 1, 0.22, 1);
    transform: translate3d(120%, -100px, 0) rotate3d(0, 0, 1, 90deg);
  }
}
```

And a bit of JS to toggle class after mouse up

```js
const Button = ({ children }) => {
  const [activated, setActivated] = React.useState(false);
  return (
    <button
      className={"button" + (activated ? " active" : "")}
      onMouseDown={() => setActivated(false)}
      onMouseUp={() => setActivated(true)}
    >
      {children}
    </button>
  );
};
```

## PS

I made it with React, but it can be achieved with plain HTML and CSS as well. I hope your main take away will be UX of a button, not the code itself.
