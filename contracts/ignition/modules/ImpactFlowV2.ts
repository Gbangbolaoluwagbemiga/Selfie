import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ImpactFlowV2Module = buildModule("ImpactFlowV2Module", (m) => {
  const impactFlow = m.contract("ImpactFlow");

  return { impactFlow };
});

export default ImpactFlowV2Module;
