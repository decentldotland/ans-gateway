import axios from "axios";
import assert from "node:assert";
import { ANS_CONTRACT_ADDRESS } from "./constants.js";

export async function getRecordValue(domain) {
  try {
    const record = await resoleDomain(domain);
    const tx = await axios.get(`https://arweave.net/${record}`, {
      responseType: "arraybuffer",
    });
    return tx;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function resoleDomain(domain) {
  try {
    const normalizedDomain = _normalizeDomain(domain);
    const ans_state = (
      await axios.get(`https://api.exm.dev/read/${ANS_CONTRACT_ADDRESS}`)
    )?.data;
    const domainOwnerIndex = ans_state.balances.findIndex((user) =>
      user.ownedDomains.map((d) => d.domain).includes(normalizedDomain)
    );
    assert(domainOwnerIndex >= 0, true);
    const domainRecord = ans_state.balances[domainOwnerIndex].ownedDomains.find(
      (d) => d.domain === normalizedDomain
    )?.record;
    assert(typeof domainRecord === "string", true);
    return domainRecord;
  } catch (error) {
    console.log(error);
    return null; // TODO: design 404 ANS-native page, then upload it to Arweave
  }
}

function _normalizeDomain(domain) {
  const caseFolded = domain.toLowerCase();
  const normalizedDomain = caseFolded.normalize("NFKC");
  assert.equal(/^[a-z0-9]{2,15}$/.test(normalizedDomain), true);
  return normalizedDomain;
}
