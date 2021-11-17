const { TezosToolkit } = require("@taquito/taquito");
const { importKey } = require("@taquito/signer");
const fs = require("fs");
require("dotenv").config();

const SANDBOX_URL = "http://127.0.0.1:20000";
const TESTNET_URL = "https://granadanet.api.tez.ie";
const FAUCET = JSON.parse(process.env.FAUCET);
const ALICE_SECRET = process.env.ALICE_SECRET;

const deploy = async () => {
  const mode = process.argv[2] || "sandbox";
  console.log(">>> Deploy with mode:", mode);

  try {
    const Tezos = new TezosToolkit(
      mode === "sandbox" ? SANDBOX_URL : TESTNET_URL
    );

    // Signing on testnet mode needs different parameters as on sandbox mode
    const { email, password, mnemonic, secret } = FAUCET;
    mode === "sandbox"
      ? await importKey(Tezos, ALICE_SECRET)
      : await importKey(Tezos, email, password, mnemonic.join(" "), secret);

    const code = fs.readFileSync("./build/counter.tz").toString();
    console.log("Originate...");
    const op = await Tezos.contract.originate({
      code,
      init: `0`,
    });

    console.log("Awaiting confirmation...");
    const contract = await op.contract();
    console.log("Deployment successful!");
    console.log(">>> Gas used:", op.consumedGas);
    console.log(">>> Storage:", await contract.storage());
    console.log(">>> Operation hash:", op.hash);
  } catch (error) {
    console.error(error);
  }
};

deploy();
