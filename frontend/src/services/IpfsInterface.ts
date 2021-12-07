import * as IPFS from "ipfs-core";
import { IPFS_GATEWAY_URL } from "@/constants";
import path from "path";

// const path = require('path')

/**
 * Class for data upload to IPFS
 */
class IpfsInterface {
  ipfs: any;

  async init() {
    this.ipfs = await IPFS.create();
  }

  async postNftData(content: any, options: any) {
    console.log(content);
    console.log(options);
    const filePath = options.path;
    //const basename = path.basename(filePath);
    console.log(filePath);
    const ipfsPath = "/nft/" + filePath;
    const { cid: assetCid } = await this.ipfs.add({
      path: ipfsPath,
      content: JSON.stringify(content),
    });
    console.log(ipfsPath);
    console.log(assetCid);
    // make the NFT metadata JSON
    const assetURI = this.ensureIpfsUriPrefix(assetCid) + "/" + filePath;
    //console.log(this.makeGatewayURL(assetURI));
    const metadata = await this.makeAssetMetadata(assetURI, options);

    // add the metadata to IPFS
    const { cid: metadataCid } = await this.ipfs.add({
      path: "/nft/metadata.json",
      content: JSON.stringify(metadata),
    });
    const metadataURI =
      this.ensureIpfsUriPrefix(metadataCid) + "/metadata.json";

    return {
      metadataURI,
      metadataGatewayURL: this.makeGatewayURL(metadataURI),
    };
  }

  /**
   * Helper to construct metadata JSON for
   * @param {string} assetCid - IPFS URI for the NFT asset
   * @param {object} options
   * @param {?string} name - optional name to set in NFT metadata
   * @param string description - optional description to store in NFT metadata
   * @returns {object} - NFT metadata object
   */
  async makeAssetMetadata(assetURI: any, options: any) {
    const { name, description } = options;
    assetURI = this.ensureIpfsUriPrefix(assetURI);
    return {
      name,
      description,
      image: assetURI,
    };
  }

  /**
   * @param string cidOrURI either a CID string, or a URI string of the form `ipfs://${cid}`
   * @returns string input string with the `ipfs://` prefix stripped off
   */
  stripIpfsUriPrefix(cidOrURI: any): string {
    if (cidOrURI.startsWith("ipfs://")) {
      return cidOrURI.slice("ipfs://".length);
    }
    return cidOrURI;
  }

  ensureIpfsUriPrefix(cidOrURI: any) {
    let uri = cidOrURI.toString();
    if (!uri.startsWith("ipfs://")) {
      uri = "ipfs://" + cidOrURI;
    }
    // Avoid the Nyan Cat bug (https://github.com/ipfs/go-ipfs/pull/7930)
    if (uri.startsWith("ipfs://ipfs/")) {
      uri = uri.replace("ipfs://ipfs/", "ipfs://");
    }
    return uri;
  }

  /**
   * Return an HTTP gateway URL for the given IPFS object.
   * @param {string} ipfsURI - an ipfs:// uri or CID string
   * @returns - an HTTP url to view the IPFS object on the configured gateway.
   */
  makeGatewayURL(ipfsURI: any) {
    return IPFS_GATEWAY_URL + "/" + this.stripIpfsUriPrefix(ipfsURI);
  }

  /**
   *
   * @param {string} cidOrURI - an ipfs:// URI or CID string
   * @returns {CID} a CID for the root of the IPFS path
   */
  // function extractCID(cidOrURI) {
  //     // remove the ipfs:// prefix, split on '/' and return first path component (root CID)
  //     const cidString = this.stripIpfsUriPrefix(cidOrURI).split('/')[0]
  //     return new CID(cidString)
  // }
}

export default IpfsInterface;
