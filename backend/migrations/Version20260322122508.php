<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260322122508 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE qcm_invitation CHANGE token token VARCHAR(255) NOT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_5ACED0B45F37A13B ON qcm_invitation (token)');
        $this->addSql('ALTER TABLE question ADD version_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E4BBC2705 FOREIGN KEY (version_id) REFERENCES qcm_version (id)');
        $this->addSql('CREATE INDEX IDX_B6F7494E4BBC2705 ON question (version_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX UNIQ_5ACED0B45F37A13B ON qcm_invitation');
        $this->addSql('ALTER TABLE qcm_invitation CHANGE token token VARCHAR(64) NOT NULL');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494E4BBC2705');
        $this->addSql('DROP INDEX IDX_B6F7494E4BBC2705 ON question');
        $this->addSql('ALTER TABLE question DROP version_id');
    }
}
