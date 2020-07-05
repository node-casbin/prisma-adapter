import { Adapter, Model } from 'casbin';
import type {
  PrismaClientOptions,
  CasbinRule,
  CasbinRuleCreateInput,
  BatchPayload,
} from '@prisma/client';

import { Helper } from 'casbin';
import { PrismaClient } from '@prisma/client';

export class PrismaAdapter implements Adapter {
  #option?: PrismaClientOptions;
  #prisma: PrismaClient;

  constructor(option?: PrismaClientOptions) {
    this.#option = option;
  }

  async loadPolicy(model: Model): Promise<void> {
    const lines = await this.#prisma.casbinRule.findMany();

    for (const line of lines) {
      this.#loadPolicyLine(line, model);
    }
  }

  async savePolicy(model: Model): Promise<boolean> {
    await this.#prisma.executeRaw`DELETE FROM casbin_rule;`;

    let astMap = model.model.get('p')!;
    const processes: Array<Promise<CasbinRule>> = [];

    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line = this.#savePolicyLine(ptype, rule);
        const p = this.#prisma.casbinRule.create({
          data: line,
        });
        processes.push(p);
      }
    }

    astMap = model.model.get('g')!;
    for (const [ptype, ast] of astMap) {
      for (const rule of ast.policy) {
        const line = this.#savePolicyLine(ptype, rule);
        const p = this.#prisma.casbinRule.create({
          data: line,
        });
        processes.push(p);
      }
    }

    // https://github.com/prisma/prisma-client-js/issues/332
    await Promise.all(processes);

    return true;
  }

  async addPolicy(sec: string, ptype: string, rule: string[]): Promise<void> {
    const line = this.#savePolicyLine(ptype, rule);
    await this.#prisma.casbinRule.create({ data: line });
  }

  async addPolicies(
    sec: string,
    ptype: string,
    rules: string[][]
  ): Promise<void> {
    const processes: Array<Promise<CasbinRule>> = [];
    for (const rule of rules) {
      const line = this.#savePolicyLine(ptype, rule);
      const p = this.#prisma.casbinRule.create({ data: line });
      processes.push(p);
    }

    // https://github.com/prisma/prisma-client-js/issues/332
    await Promise.all(processes);
  }

  async removePolicy(
    sec: string,
    ptype: string,
    rule: string[]
  ): Promise<void> {
    const line = this.#savePolicyLine(ptype, rule);
    await this.#prisma.casbinRule.deleteMany({ where: line });
  }

  async removePolicies(
    sec: string,
    ptype: string,
    rules: string[][]
  ): Promise<void> {
    const processes: Array<Promise<BatchPayload>> = [];
    for (const rule of rules) {
      const line = this.#savePolicyLine(ptype, rule);
      const p = this.#prisma.casbinRule.deleteMany({ where: line });
      processes.push(p);
    }

    // https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/transactions#bulk-operations
    await Promise.all(processes);
  }

  async removeFilteredPolicy(
    sec: string,
    ptype: string,
    fieldIndex: number,
    ...fieldValues: string[]
  ): Promise<void> {
    const line: CasbinRuleCreateInput = { ptype };

    const idx = fieldIndex + fieldValues.length;
    if (fieldIndex <= 0 && 0 < idx) {
      line.v0 = fieldValues[0 - fieldIndex];
    }
    if (fieldIndex <= 1 && 1 < idx) {
      line.v1 = fieldValues[1 - fieldIndex];
    }
    if (fieldIndex <= 2 && 2 < idx) {
      line.v2 = fieldValues[2 - fieldIndex];
    }
    if (fieldIndex <= 3 && 3 < idx) {
      line.v3 = fieldValues[3 - fieldIndex];
    }
    if (fieldIndex <= 4 && 4 < idx) {
      line.v4 = fieldValues[4 - fieldIndex];
    }
    if (fieldIndex <= 5 && 5 < idx) {
      line.v5 = fieldValues[5 - fieldIndex];
    }

    await this.#prisma.casbinRule.deleteMany({ where: line });
  }

  async close(): Promise<any> {
    return this.#prisma.disconnect();
  }

  static async newAdapter(
    option?: PrismaClientOptions
  ): Promise<PrismaAdapter> {
    const a = new PrismaAdapter(option);
    await a.#open();

    return a;
  }

  #open = async (): Promise<void> => {
    this.#prisma = new PrismaClient(this.#option);
    await this.#prisma.connect();
  };

  #loadPolicyLine = (line: CasbinRuleCreateInput, model: Model): void => {
    const result =
      line.ptype +
      ', ' +
      [line.v0, line.v1, line.v2, line.v3, line.v4, line.v5]
        .filter((n) => n)
        .join(', ');
    Helper.loadPolicyLine(result, model);
  };

  #savePolicyLine = (ptype: string, rule: string[]): CasbinRuleCreateInput => {
    const line: CasbinRuleCreateInput = { ptype };

    if (rule.length > 0) {
      line.v0 = rule[0];
    }
    if (rule.length > 1) {
      line.v1 = rule[1];
    }
    if (rule.length > 2) {
      line.v2 = rule[2];
    }
    if (rule.length > 3) {
      line.v3 = rule[3];
    }
    if (rule.length > 4) {
      line.v4 = rule[4];
    }
    if (rule.length > 5) {
      line.v5 = rule[5];
    }

    return line;
  };
}
