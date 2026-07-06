import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ enum: ['ok', 'error', 'shutting_down'], example: 'ok' })
  status: 'ok' | 'error' | 'shutting_down';

  @ApiProperty({ example: { memory_heap: { status: 'up' } } })
  info: Record<string, unknown>;

  @ApiProperty({ example: {} })
  error: Record<string, unknown>;

  @ApiProperty({ example: { memory_heap: { status: 'up' } } })
  details: Record<string, unknown>;
}
