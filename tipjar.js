(function () {
  class BittipsWidget extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
      const widgetContainer = document.createElement('div');
      widgetContainer.classList.add('bittips-widget');
      let tips = null;
      widgetContainer.innerHTML = `
        <style>
          .bittips-widget{
            display: inline-flex;
          }
          .bittips-widget-container{
            display: flex;
            align-items: center;
            justify-content: start;
            width: fit-content;
            flex-direction: row;
            padding: 5px;
          }
        </style>
        <div class="bittips-widget-container">
          <div class="bittips-widget-content"></div>
        </div>
      `;
      shadow.appendChild(widgetContainer);
    }
    // fires after the element has been attached to the DOM
    connectedCallback() {
      
      const url = `https://api.bit.tips/v1/tips/${this.payTag}`;
      const opts = {
        method: "GET"
      };
      fetch(url, opts)
        .then(res => res.json())
        .then(
          (response) => {
            this.tips = response;
            this.refreshHTML();
          })
        .catch(console.error);
    }

    refreshHTML()
    {
      const content = this.shadowRoot.querySelector('.bittips-widget-content');
      var contentHTML = this.tips.addresses.length > 0 ? this.tips.addresses.map(item =>
        `<a href="https://bit.tips/${this.payTag}/s/${item.type.substring(0, 1)}/${item.code}" aria-label="Tip using ${this.icons(item.code).selectlabel}" target="_blank" rel="noopener noreferrer">${this.icons(item.code).icon}</a>`).join('')
        : 'No payment method added.'
        content.innerHTML = contentHTML; 
      
    }  

    sanitizeString(str) { 
      var res = '';
      try{
          res = str.match(/</g) || str.match(/>/g) || str.match(/"/g)|| str.match(/\//g);
          if(res){
            return '';//reject if contains above chars possible xss
          }

          res = String(str).replace(/&/g, '&amp;').replace(/'/g, '&#x27'); //allow & , ' after encoding  
          return res;        
        }
        catch(err){//certain xss string will cause exception, catch and reject
          console.log(err);
        }
        return '';
    }

    icons(code){
      var iconList = [
        {
          code: 'BTC',
          selectlabel: 'Bitcoin',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="32" height="32" style="vertical-align: middle; margin-right: 5px;"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#F7931A"></circle><title>Pay in Bitcoin</title><path fill="#FFF" fill-rule="nonzero" d="M23.189 14.02c.314-2.096-1.283-3.223-3.465-3.975l.708-2.84-1.728-.43-.69 2.765c-.454-.114-.92-.22-1.385-.326l.695-2.783L15.596 6l-.708 2.839c-.376-.086-.746-.17-1.104-.26l.002-.009-2.384-.595-.46 1.846s1.283.294 1.256.312c.7.175.826.638.805 1.006l-.806 3.235c.048.012.11.03.18.057l-.183-.045-1.13 4.532c-.086.212-.303.531-.793.41.018.025-1.256-.313-1.256-.313l-.858 1.978 2.25.561c.418.105.828.215 1.231.318l-.715 2.872 1.727.43.708-2.84c.472.127.93.245 1.378.357l-.706 2.828 1.728.43.715-2.866c2.948.558 5.164.333 6.097-2.333.752-2.146-.037-3.385-1.588-4.192 1.13-.26 1.98-1.003 2.207-2.538zm-3.95 5.538c-.533 2.147-4.148.986-5.32.695l.95-3.805c1.172.293 4.929.872 4.37 3.11zm.535-5.569c-.487 1.953-3.495.96-4.47.717l.86-3.45c.975.243 4.118.696 3.61 2.733z"></path></g></svg>'
        },
        {
          code: 'ETH',
          selectlabel: 'Ethereum',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="32" height="32" style="vertical-align: middle; margin-right: 5px;"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#627EEA"></circle><title>Pay in Ethereum</title><g fill="#FFF" fill-rule="nonzero"><path fill-opacity=".602" d="M16.498 4v8.87l7.497 3.35z"></path><path d="M16.498 4L9 16.22l7.498-3.35z"></path><path fill-opacity=".602" d="M16.498 21.968v6.027L24 17.616z"></path><path d="M16.498 27.995v-6.028L9 17.616z"></path><path fill-opacity=".2" d="M16.498 20.573l7.497-4.353-7.497-3.348z"></path><path fill-opacity=".602" d="M9 16.22l7.498 4.353v-7.701z"></path></g></g></svg>'
        },
        {
          code: 'LTC',
          selectlabel: 'Litecoin',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="32" height="32" viewBox="0 0 32 32" style="vertical-align: middle; margin-right: 5px;"><g fill="none" fill-rule="evenodd"><circle cx="16" cy="16" r="16" fill="#BFBBBB"><title>Pay in Litecoin</title></circle><path fill="#FFF" d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"></path></g></svg>'
        },
        {
          code: 'CASHAPP',
          selectlabel: 'CashApp',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="32" height="32" viewBox="0 0 32 32" style="vertical-align: middle; margin-right: 5px;"><title>Pay with CashApp</title><g><path stroke="null" id="svg_1" d="m7.111122,0.25l17.777804,0c3.927117,0 7.111122,3.184004 7.111122,7.111121l0,17.777802c0,3.927116 -3.184005,7.111121 -7.111122,7.111121l-17.777804,0c-3.927117,0 -7.111122,-3.184004 -7.111122,-7.111121l0,-17.777802c0,-3.927116 3.184005,-7.111121 7.111122,-7.111121z" fill="#64dd17"></path><path id="svg_2" d="m14.306092,25.933088c-0.122,0 -0.245,-0.001 -0.37,-0.004c-3.612,-0.088 -5.98,-2.312 -6.781,-3.198c-0.177,-0.195 -0.171,-0.489 0.011,-0.68l1.664,-1.876c0.178,-0.187 0.464,-0.209 0.667,-0.05c0.738,0.58 2.446,2.054 4.696,2.177c2.612,0.142 3.829,-0.601 3.986,-1.736c0.149,-1.075 -0.375,-1.986 -3.277,-2.739c-5.185,-1.345 -6.115,-4.37 -5.796,-6.897c0.335,-2.659 3.09,-4.777 6.285,-4.745c4.566,0.047 7.38,2.086 8.361,2.938c0.22,0.191 0.225,0.525 0.018,0.73l-1.581,1.786c-0.165,0.164 -0.422,0.195 -0.617,0.068c-0.799,-0.52 -2.392,-2.074 -5.236,-2.074c-1.75,0 -2.816,0.668 -2.927,1.541c-0.154,1.22 0.661,2.274 3.155,2.837c5.527,1.247 6.457,4.467 5.87,7.068c-0.54,2.395 -3.277,4.854 -8.128,4.854z" fill="#fafafa"></path><path id="svg_3" d="m19.282092,8.592088l0.839,-3.99c0.066,-0.31 -0.172,-0.602 -0.489,-0.602l-3.065,0c-0.236,0 -0.441,0.166 -0.489,0.397l-0.843,4.011l4.047,0.184z" fill="#fafafa"></path><path id="svg_4" d="m12.166092,23.000088l-0.925,4.397c-0.065,0.311 0.172,0.603 0.49,0.603l3.065,0c0.236,0 0.441,-0.166 0.489,-0.397l0.968,-4.603l-4.087,0z" fill="#fafafa"></path></g></svg>'
        },
        {
          code: 'VENMO',
          selectlabel: 'Venmo',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="32" height="32" viewBox="0 0 32 32" style="vertical-align: middle; margin-right: 5px;"><g id="svg_1" transform="matrix(0.06430186124787829,0,0,0.0640812094452618,-0.5898852833622503,28.431759447640708) "><rect x="0" id="svg_2" fill="#3396cd" width="516" height="516" rx="61" y="-452"><title>Pay with Venmo</title></rect><path id="svg_3" fill="#fff" d="m385.16,-347c11.1,18.3 16.08,37.17 16.08,61c0,76 -64.87,174.7 -117.52,244l-120.22,0l-48.2,-288.35l105.3,-10l25.6,205.17c23.8,-38.82 53.23,-99.82 53.23,-141.38c0,-22.77 -3.9,-38.25 -10,-51l95.73,-19.44z"></path></g></svg>'
        },
        {
          code: 'PAYPAL',
          selectlabel: 'PayPal',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" overflow="visible" width="25" height="32" viewBox="0 0 25 32" style="vertical-align: middle; margin-right: 5px;"><g><title>Pay with Paypal</title><path d="m 7.2659888,29.154 0.523,-3.322 -1.165,-0.027 -5.563,0 3.866,-24.513 c 0.012,-0.074 0.051,-0.143 0.108,-0.192 0.057,-0.049 0.13,-0.076 0.206,-0.076 l 9.3800002,0 c 3.114,0 5.263,0.648 6.385,1.927 0.526,0.6 0.861,1.227 1.023,1.917 0.17,0.724 0.173,1.589 0.007,2.644 l -0.012,0.077 0,0.676 0.526,0.298 c 0.443,0.235 0.795,0.504 1.065,0.812 0.45,0.513 0.741,1.165 0.864,1.938 0.127,0.795 0.085,1.741 -0.123,2.812 -0.24,1.232 -0.628,2.305 -1.152,3.183 -0.482,0.809 -1.096,1.48 -1.825,2 -0.696,0.494 -1.523,0.869 -2.458,1.109 -0.906,0.236 -1.939,0.355 -3.072,0.355 l -0.73,0 c -0.522,0 -1.029,0.188 -1.427,0.525 -0.399,0.344 -0.663,0.814 -0.744,1.328 l -0.055,0.299 -0.924,5.855 -0.042,0.215 c -0.011,0.068 -0.03,0.102 -0.058,0.125 -0.025,0.021 -0.061,0.035 -0.096,0.035 l -4.5070002,0 z" id="path3349" style="fill: rgb(37, 59, 128);"></path><path d="m 23.047989,7.667 0,0 0,0 c -0.028,0.179 -0.06,0.362 -0.096,0.55 -1.237,6.351 -5.469,8.545 -10.874,8.545 l -2.7520002,0 c -0.661,0 -1.218,0.48 -1.321,1.132 l 0,0 0,0 -1.409,8.936 -0.399,2.533 c -0.067,0.428 0.263,0.814 0.695,0.814 l 4.8810002,0 c 0.578,0 1.069,-0.42 1.16,-0.99 l 0.048,-0.248 0.919,-5.832 0.059,-0.32 c 0.09,-0.572 0.582,-0.992 1.16,-0.992 l 0.73,0 c 4.729,0 8.431,-1.92 9.513,-7.476 0.452,-2.321 0.218,-4.259 -0.978,-5.622 -0.362,-0.411 -0.811,-0.752 -1.336,-1.03 z" id="path3351" style="fill: rgb(23, 155, 215);"></path><path d="m 21.753989,7.151 c -0.189,-0.055 -0.384,-0.105 -0.584,-0.15 -0.201,-0.044 -0.407,-0.083 -0.619,-0.117 -0.742,-0.12 -1.555,-0.177 -2.426,-0.177 l -7.352,0 c -0.181,0 -0.353,0.041 -0.507,0.115 C 9.9269888,6.985 9.6749888,7.306 9.6139888,7.699 l -1.564,9.906 -0.045,0.289 c 0.103,-0.652 0.66,-1.132 1.321,-1.132 l 2.7520002,0 c 5.405,0 9.637,-2.195 10.874,-8.545 0.037,-0.188 0.068,-0.371 0.096,-0.55 -0.313,-0.166 -0.652,-0.308 -1.017,-0.429 -0.09,-0.03 -0.183,-0.059 -0.277,-0.087 z" id="path3353" style="fill: rgb(34, 45, 101);"></path><path d="m 9.6139888,7.699 c 0.061,-0.393 0.313,-0.714 0.6520002,-0.876 0.155,-0.074 0.326,-0.115 0.507,-0.115 l 7.352,0 c 0.871,0 1.684,0.057 2.426,0.177 0.212,0.034 0.418,0.073 0.619,0.117 0.2,0.045 0.395,0.095 0.584,0.15 0.094,0.028 0.187,0.057 0.278,0.086 0.365,0.121 0.704,0.264 1.017,0.429 0.368,-2.347 -0.003,-3.945 -1.272,-5.392 C 20.377989,0.682 17.852989,0 14.621989,0 L 5.2419888,0 c -0.66,0 -1.223,0.48 -1.325,1.133 L 0.00998882,25.898 c -0.077,0.49 0.301,0.932 0.795,0.932 l 5.79099998,0 1.454,-9.225 1.564,-9.906 z" id="path3355" style="fill: rgb(37, 59, 128);"></path></g></svg>'
        },
      ]
      return iconList.find(icon => icon.code === code);
    }
    get payTag() {
      return this.sanitizeString(this.getAttribute('pay-tag') || '');
    }
  }
  customElements.define('bittips-widget', BittipsWidget);
})();
