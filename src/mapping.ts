import { BigInt, log, Address } from "@graphprotocol/graph-ts"
import { EAS, Attested, Revoked } from "../generated/EAS/EAS"
import { ASRegistry, Registered } from "../generated/ASRegistry/ASRegistry"
import { Attestation, ASSchema } from "../generated/schema"



export function handleRegisteredAS(event: Registered): void {
  let entity = new ASSchema(event.params.uuid.toHex())
  let schemaContract = ASRegistry.bind(event.address)

  let schema = schemaContract.getAS(event.params.uuid);
  entity.schemaData = schema.schema;
  entity.schema = schema.schema.toString();
  entity.resolver = schema.resolver.toHexString();
  entity.txid = event.transaction.hash;
  entity.creator = event.params.attester.toHexString();
  entity.index = schema.index;
  entity.save()
}

export function handleAttested(event: Attested): void {
  let entity = Attestation.load(event.params.uuid.toHex())

  if (entity == null) {
    entity = new Attestation(event.params.uuid.toHex())
  }

  entity.recipient = event.params.recipient
  entity.attester = event.params.attester
  entity.schema = event.params.schema.toHexString()

  let easContract = EAS.bind(event.address)
  let att = easContract.getAttestation(event.params.uuid)

  entity.data = att.data
  entity.time = att.time
  entity.expirationTime = att.expirationTime
  entity.revocationTime = att.revocationTime
  entity.refUUID = att.refUUID
  entity.txid = event.transaction.hash;
  entity.revoked = false
  entity.save();

  // - contract.VERSION(...)
  // - contract.getASRegistry(...)
  // - contract.getAttestation(...)
  // - contract.getAttestationsCount(...)
  // - contract.getEIP712Verifier(...)
  // - contract.getReceivedAttestationUUIDs(...)
  // - contract.getReceivedAttestationUUIDsCount(...)
  // - contract.getRelatedAttestationUUIDs(...)
  // - contract.getRelatedAttestationUUIDsCount(...)
  // - contract.getSchemaAttestationUUIDs(...)
  // - contract.getSchemaAttestationUUIDsCount(...)
  // - contract.getSentAttestationUUIDs(...)
  // - contract.getSentAttestationUUIDsCount(...)
  // - contract.isAttestationValid(...)
}

export function handleRevoked(event: Revoked): void {
  let entity = Attestation.load(event.params.uuid.toHex())
  entity.revoked = true
  entity.save()
}
