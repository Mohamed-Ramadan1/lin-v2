import { Entity, PrimaryColumn, CreateDateColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn({
    type: 'uuid',
    default: () => 'gen_random_uuid()',
  })
  id!: string;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  email!: string;

  @Column({ type: 'varchar', length: 255, select: false })
  passwordHash!: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @CreateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @Column({ type: 'timestamp', nullable: true })
  termsAcceptedAt!: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  termsVersion!: string | null;
}
