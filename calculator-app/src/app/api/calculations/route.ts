import 'reflect-metadata';
import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/dataSource';
import { Calculation } from '@/entity/Calculation';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json({ calculations }, { status: 200 });
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { expression, result } = body;

    if (!expression || result === undefined || result === null) {
      return NextResponse.json(
        { error: 'expression and result are required' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const repo = dataSource.getRepository(Calculation);

    const calc = repo.create({
      expression: String(expression),
      result: String(result),
    });

    await repo.save(calc);

    return NextResponse.json({ calculation: calc }, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to save calculation' },
      { status: 500 }
    );
  }
}
