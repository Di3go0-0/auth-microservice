import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class VerifyTokenDto {
  @ApiProperty({
    type: String,
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM5ZGM0MWIyLTFiZTQtNGUyZC04Y2U5LTljZmQ2MWNmZGQyZCIsImVtYWlsIjoicGVwaXRvQGNvcnJlby5jb20iLCJpYXQiOjE3NDg0MDAwNjYsImV4cCI6MTc0ODQ0MzI2Nn0.NtNHRdsutARHfTH_0Samn8DMyL0Rut5JZvac9p4Hm7w',
    required: true,
    description: 'Token for user authentication',
  })
  @IsString()
  token: string;
}
