class LoadingSpinner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
        <style>
          .loader {
            height: 40px;
            margin:auto;
            aspect-ratio: 6;
            --c: #0000 64%, #62b1df 66% 98%, #0000 101%;
            background:
              radial-gradient(35% 146% at 50% 159%,var(--c)) 0 0,
              radial-gradient(35% 146% at 50% -59%,var(--c)) 25% 100%;
            background-size: calc(100%/3) 50%;
            background-repeat: repeat-x;
            animation: l1 1.5s infinite linear;
            margin: 3rem auto;
          }
          @keyframes l1{
            to {background-position: 50% 0,75% 100%}
          }
        </style>
        <div class="loader"></div>
      `;
  }
}

customElements.define("loading-spinner", LoadingSpinner);
