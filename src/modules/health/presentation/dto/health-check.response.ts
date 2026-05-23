import { ApiProperty } from '@nestjs/swagger';

export class HealthCheckResponseDto {
  @ApiProperty({ example: 'ok' })
  status: 'ok';

  @ApiProperty({ example: '2026-05-23T00:00:00.000Z' })
  timestamp: string;

  @ApiProperty({ example: 12.34 })
  uptime: number;
}
