/**
 * Validates a portuguese mobile number
 * @param {String} mn - Mobile Number
 */

const isValidMobileNumber = async mn => {
  return /^9(0|1|2|3|6)\d{7}$/g.test(mn)
}

/**
 * Validates a portuguese license plate
 * @param {String} plate - Plate Number
 */

const isValidLicensePlate = async plate => {
  return /^(?=.*\d)[A-Za-z0-9]{1,11}/g.test(plate)
}

/**
 * Validates a portuguese postal code
 * @param {String} pc - Postal Code
 */

const isValidPostalCode = async pc => {
  return /^\d{4}\-\d{3}$/g.test(pc)
}

/**
 * Validates a portuguese fiscal number (NIF)
 * @param {String} nif - VAT Number
 */
const isValidNIF = async nif => {
  if (!/^\d{9}$/g.test(nif)) {
    return false;
  }

  const split = nif.split('')
  const ident = split[0]

  if (['0', '3', '4', '7'].indexOf(ident) !== -1) {
    return false
  }

  const total = split
    .slice(0, split.length - 1)
    .map(sp => parseInt(sp, 10))
    .reduce(
      (sum, nif, index, array) => sum + nif * (array.length + 1 - index),
      0
    )
  const divided = 11 - total % 11
  const control = divided >= 10 ? 0 : divided
  return control === parseInt(split[split.length - 1], 10)
};

const handleRequest = async event => {
  const params = {};
  let result = {};
  const url = new URL(event.request.url);
  const queryString = url.search.slice(1).split('&');
  
  queryString.forEach(item => {
    const kv = item.split('=')
    if (kv[0]) params[kv[0]] = kv[1] || true
  });

  if(params.nif) {    
    result = {
      nif: parseInt(params.nif, 10),
      valid: await isValidNIF(params.nif)
    };
  }

  if(params.pc) { 
    result = {
      pc: params.pc,
      valid: await isValidPostalCode(params.plate)
    };
  }

  if(params.plate) { 
    result = {
      plate: params.plate,
      valid: await isValidLicensePlate(params.plate)
    };
  }

  if(params.mn) { 
    result = {
      mn: parseInt(params.mn),
      valid: await isValidMobileNumber(params.mn)
    };
  }

  const responseInit = {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*"
    }
  };

  return new Response(JSON.stringify(result), responseInit);
};

addEventListener("fetch", event => event.respondWith(handleRequest(event)));