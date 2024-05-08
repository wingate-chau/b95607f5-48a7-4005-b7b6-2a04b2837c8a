import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional } from 'class-validator';

const durationAgo = ['30|d', '60|d', '1|y'] as const;

export type DurationAgoEnum = (typeof durationAgo)[number];

export class GetSavingsQueryDto {
  /**
   * @example 2023-01-01T00:00:00.000Z
   */
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: "overriden by 'durationAgo' field",
  })
  @Type(() => Date)
  from?: Date;

  /**
   * @example 2023-01-30T00:00:00.000Z
   */
  @IsDate()
  @IsOptional()
  @ApiProperty({
    description: "overriden by 'durationAgo' field",
  })
  @Type(() => Date)
  to?: Date;

  /**
   * @example
   */
  @IsEnum(durationAgo, {
    message: `durationAgo must be one of the following values ${durationAgo}`,
  })
  @ApiProperty({
    enum: durationAgo,
    description: "override 'from' and 'too' fields if not empty",
  })
  @IsOptional()
  durationAgo?: DurationAgoEnum;
}
