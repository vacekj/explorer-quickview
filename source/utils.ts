import keccak from "keccak";

function checkAddressChecksum(address: string, chainId: string) {
  const stripAddress = stripHexPrefix(address).toLowerCase();
  const prefix = chainId !== null ? chainId.toString() + "0x" : "";
  const keccakHash = keccak("keccak256")
    .update(prefix + stripAddress)
    .digest("hex");

  for (let i = 0; i < stripAddress.length; i++) {
    let output = parseInt(keccakHash[i], 16) >= 8
      ? stripAddress[i].toUpperCase()
      : stripAddress[i];
    if (stripHexPrefix(address)[i] !== output) {
      return false;
    }
  }
  return true;
}

function stripHexPrefix(value: string) {
  return value.slice(0, 2) === "0x" ? value.slice(2) : value;
}

module.exports = {
  checkAddressChecksum,
};
