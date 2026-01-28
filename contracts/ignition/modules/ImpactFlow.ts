import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ImpactFlowModule = buildModule("ImpactFlowModule", (m) => {
  const impactFlow = m.contract("ImpactFlow");

  return { impactFlow };
});

export default ImpactFlowModule;
