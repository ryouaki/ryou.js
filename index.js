class Ryou {
  static events = {
    /* dom */
    'onClick': 'onclick',

    /* input */
    'onChange': 'onchange'
  }

  constructor() {
    this.tag = this.__proto__.constructor.name || 'ryou';
    this.ele = null;
    this.children = [];
    this.value = '';
    this.html = '';
    this.text = '';
    this.key = '';
  }

  setValue(value) {
    this.value = value;
  }

  setText(text) {
    this.text = text;
  }

  appendChild(child) {
    this.children.push(child);
  }

  mounted() {
    this.afterMounted();
    this.children.forEach((child) => {
      child.mounted();
    })
  }
  
  beforeMount() {

  }

  afterMounted() {

  }

  beforeUpdate() {

  }

  afterUpdated() {

  }

  shouldUpdate() {
    if (this.value != this.ele.value || this.text != this.ele.text) {
      return true;
    } else {
      return false;
    }
  }

  toElement() {
    this.beforeMount();
    const ele = document.createElement(this.tag.toLowerCase());
    this.ele = ele;
    this.ele.value = this.value;
    this.ele.text = this.ele.innerText = this.text;

    const methodsFromProto = Object.getOwnPropertyNames(this.__proto__);
    const methodsFromObj = Object.keys(this);

    methodsFromProto.forEach((method) => {
      const handle = Ryou.events[method];
      if (handle) {
        this.ele[handle] = this[method].bind(this);
      }
    })

    methodsFromObj.forEach((method) => {
      const handle = Ryou.events[method];
      if (handle) {
        this.ele[handle] = this[method].bind(this);
      }
    })

    this.children.forEach((child) => {
      this.ele.appendChild(child.toElement());
    })
    return ele;
  }

  updateElement() {
    this.beforeUpdate();
    if (this.shouldUpdate()) {
      this.ele.value = this.value;
      this.ele.innerText = this.text;
      this.children.forEach((child) => {
        child.updateElement();
      })
    }
    this.afterUpdated();
  }
}

class Div extends Ryou {
  constructor() {
    super();
    this.text = 'hello world'
  }
  beforeMount() {
    console.log('beforeMount')
  }
}

class Input extends Ryou {
  constructor() {
    super();
  }

  afterMounted() {
    console.log('afterMounted',this.ele)
  }
}

class CustomDiv extends Ryou {
  constructor() {
    super();
    this.init();
  }

  init() {
    const div = new Div();
    div.onClick = () => {
      alert('Hello')
    };
    div.setText('Div2');
    this.appendChild(div);

    const inp = new Input();
    inp.onChange = (event) => {
      div.setText(event.target.value);
      div.updateElement();
    }
    this.appendChild(inp);
  }
}

class App {
  constructor(Element, dom) {
    this.rootDom = dom;
    this.rootElement = Element;
  }

  render() {
    const root = document.querySelector(this.rootDom);
    root.appendChild(this.rootElement.toElement());
    this.rootElement.mounted();
  }
}

const root = new Ryou();
const child = new Div();
const child1 = new Input();
const child2 = new CustomDiv();
child.setValue('Hello world!');
root.appendChild(child);
root.appendChild(child1);
root.appendChild(child2);
const app = new App(root, '#root');
app.render();
